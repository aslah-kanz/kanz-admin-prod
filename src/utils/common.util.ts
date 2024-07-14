import { TBadgeVariant } from '@/components/ui/badge';
import { TImage } from '@/types/image.type';

/**
 * Image props
 */
export function commonImageProps(props: TImage) {
  return {
    src: props.url,
    width: props.width,
    height: props.height,
    alt: props.name,
  };
}

/**
 *
 * @param sizeInBytes
 * @returns
 */
export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));

  return `${parseFloat((sizeInBytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * convert string from original to slug
 * @param input
 * @returns
 */
export function originalToSlug(input: string): string {
  return input.toLowerCase().replace(/\s+/g, '_');
}

/**
 * convert string from slug to original
 * @param slug
 * @returns
 */
export function slugToOriginal(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Create fullname
 * @param firstName
 * @param lastName
 * @returns
 */
export function createFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

/**
 * Get badge variant
 * @param status
 * @returns
 */
export const getBadgeVariant = (text: string): TBadgeVariant => {
  // const status = originalToSlug(text);
  switch (text) {
    case 'active':
    case 'accepted':
    case 'completed':
    case 'published':
    case 'approved':
      return 'green';
    case 'new_request':
      return 'purple';
    case 'pendingCompanyDetail':
    case 'pendingPrincipalDetail':
    case 'waiting_payment':
    case 'pending':
    case 'onDelivery':
      return 'yellow';
    case 'waiting_respond':
    case 'waiting_for_acceptance':
      return 'amber';
    case 'inactive':
    case 'rejected':
    case 'exchange':
    case 'canceled':
      return 'red';
    case 'waiting_confirmation':
    case 'confirm':
    case 'process':
    case 'draft':
    case 'waitingReview':
    case 'pendingApproval':
    case 'open':
      return 'blue';
    case 'on_process':
      return 'orange';
    default:
      return 'default';
  }
};

/**
 * Transform status
 * @param str
 * @returns
 */
export function transformStatus(str: string): string {
  // Use a regular expression to split the string on uppercase letters
  const words = str
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

/**
 * Text truncate
 * @param text
 * @returns
 */
export function textTruncate(text: string, max: number = 50) {
  if (text?.split('').length > max) {
    return `${text.slice(0, max)}...`;
  }
  return text;
}

/**
 * Convert to currency
 * @param numberInput
 * @returns
 */
export function convertToCurrency(numberInput: number) {
  if (numberInput) {
    const number_string = numberInput
      .toString()
      .replace(/[^,\d]/g, '')
      .toString();
    const split = number_string.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? ',' : '';

      rupiah += separator + ribuan.join(',');
    }

    rupiah = split[1] !== undefined ? `${rupiah}.${split[1]}` : rupiah;

    return rupiah;
  }
  return numberInput;
}

export function capitalizeFirstLetter(string: string) {
  if (string) {
    return (
      string &&
      string.charAt(0) &&
      string.charAt(0).toUpperCase() + string.slice(1)
    );
  }

  return string;
}
