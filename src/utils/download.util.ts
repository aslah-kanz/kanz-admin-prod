export function downloadBuffer(buffer: Buffer, name: string) {
  // Membuat Blob dari buffer
  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  // Membuat URL objek dari Blob
  const url = window.URL.createObjectURL(blob);

  // Membuat elemen anchor
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);

  // Mengklik elemen anchor untuk memicu unduhan
  a.click();

  // Membersihkan URL objek setelah unduhan selesai
  window.URL.revokeObjectURL(url);
}
