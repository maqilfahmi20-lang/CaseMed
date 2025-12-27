'use client';

import { useState } from 'react';
import { deleteQuestion } from '@/app/actions/admin/soal';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return;

    setIsDeleting(true);
    const result = await deleteQuestion(id);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {isDeleting ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
