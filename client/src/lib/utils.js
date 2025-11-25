// formattatore di date

export const formatDate = (dateString) => {
  if (!dateString) return 'In corso...';
  return new Date(dateString).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
