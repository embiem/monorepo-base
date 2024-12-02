import { Router } from 'express';
import { ApiResponse } from '@monorepo/shared';

const router = Router();

router.get('/', (req, res) => {
  const response: ApiResponse<{ message: string }> = {
    data: { message: 'API is running' },
    status: 200,
    message: 'Success'
  };
  res.json(response);
});

export default router;