import { Router } from "express";
import { eq } from "drizzle-orm";
import { ApiTypes, AuthTypes, Utils, Database } from "@monorepo/shared";

const router = Router();
const redis = Utils.createRedisConnection();
const db = Database.createConnection();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name }: AuthTypes.RegisterData = req.body;

    // Check if user exists
    const existingUser = await db
      .select()
      .from(Database.users)
      .where(eq(Database.users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "User already exists",
        data: null,
      });
    }

    const hashedPassword = await Utils.hashPassword(password);

    // Create new user
    const [newUser] = await db
      .insert(Database.users)
      .values({
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    if (!newUser) {
      return res.status(400).json({
        status: 400,
        message: "User not created",
        data: null,
      });
    }

    const tokens = Utils.generateTokens({
      userId: newUser.id.toString(),
      email,
    });
    await redis.set(
      `refresh_token:${newUser?.id}`,
      tokens.refreshToken,
      "EX",
      60 * 60 * 24 * 7,
    ); // 7 days

    const response: ApiTypes.ApiResponse<AuthTypes.AuthTokens> = {
      data: tokens,
      status: 200,
      message: "Registration successful",
    };

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: 500,
      message: "Registration failed",
      data: null,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password }: AuthTypes.LoginCredentials = req.body;

    // Get user
    const [user] = await db
      .select()
      .from(Database.users)
      .where(eq(Database.users.email, email))
      .limit(1);
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
        data: null,
      });
    }

    const isValidPassword = await Utils.comparePasswords(
      password,
      user.password,
    );
    if (!isValidPassword) {
      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
        data: null,
      });
    }

    const tokens = Utils.generateTokens({ userId: user.id.toString(), email });
    await redis.set(
      `refresh_token:${user.id}`,
      tokens.refreshToken,
      "EX",
      60 * 60 * 24 * 7,
    ); // 7 days

    const response: ApiTypes.ApiResponse<AuthTypes.AuthTokens> = {
      data: tokens,
      status: 200,
      message: "Login successful",
    };

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: 500,
      message: "Login failed",
      data: null,
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: "No refresh token",
        data: null,
      });
    }

    // Verify refresh token and generate new tokens
    const payload = Utils.verifyRefreshToken(refreshToken);
    const storedToken = await redis.get(`refresh_token:${payload.userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({
        status: 401,
        message: "Invalid refresh token",
        data: null,
      });
    }

    const tokens = Utils.generateTokens({
      userId: payload.userId,
      email: payload.email,
    });
    await redis.set(
      `refresh_token:${payload.userId}`,
      tokens.refreshToken,
      "EX",
      60 * 60 * 24 * 7,
    );

    const response: ApiTypes.ApiResponse<AuthTypes.AuthTokens> = {
      data: tokens,
      status: 200,
      message: "Token refresh successful",
    };

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json(response);
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({
      status: 401,
      message: "Invalid refresh token",
      data: null,
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const payload = Utils.verifyRefreshToken(refreshToken);
      await redis.del(`refresh_token:${payload.userId}`);
    }

    res.clearCookie("refreshToken");
    res.json({
      status: 200,
      message: "Logout successful",
      data: null,
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.json({
      status: 200,
      message: "Logout successful",
      data: null,
    });
  }
});

export default router;

