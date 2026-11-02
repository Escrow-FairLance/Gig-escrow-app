import { redirect } from 'next/navigation';

export default function CreateJobRedirect() {
  redirect('/jobs/new');
}
