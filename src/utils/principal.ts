export function formatStatus(str: string): string {
  let status = '';

  switch (str) {
    case 'pendingApproval':
      status = 'need approve';
      break;
    case 'pendingPrincipalDetail':
    case 'pendingCompanyDetail':
      status = 'need detail';
      break;
    default:
      status = str;
  }
  // Use a regular expression to split the string on uppercase letters
  const words = status
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ');

  // Capitalize the first letter of each word and make the rest lowercase
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );

  // Join the capitalized words with a space in between
  return capitalizedWords.join(' ');
}
