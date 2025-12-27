import { requireAdmin } from '@/lib/auth';
import TambahPaketForm from './form';

export default async function TambahPaketPage() {
  await requireAdmin();

  return <TambahPaketForm />;
}
