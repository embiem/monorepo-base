import { validateEmail } from '@monorepo/shared';

export default function EmailValidator() {
  return (
    <p className="mt-4">
      Email validation example: {validateEmail('test@example.com') ? 'Valid' : 'Invalid'}
    </p>
  );
}