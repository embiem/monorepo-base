import { Utils } from "@monorepo/shared";

export default function EmailValidator() {
  return (
    <p className="mt-4">
      Email validation example:{" "}
      {Utils.validateEmail("test@example.com") ? "Valid" : "Invalid"}
    </p>
  );
}
