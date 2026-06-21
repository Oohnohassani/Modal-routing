// Format numbers
export function formatNumbers(num) {
  if (num >= 1000 && num <= 999_999) {
    return (num / 1000).toFixed(1).concat("k");
  }

  if (num > 100_000) {
    return (num / 100_000).toFixed(1).concat("m");
  }

  return num;
}

export function formatBigNumbers(num) {
  return new Intl.NumberFormat("en-US", {
    // style: "currency",
    // currency: "USD",
    // minimumFractionDigits: 2,
    // maximumFractionDigits: 2
  }).format(num); // "$1,234.50"
}

export function highlightHashtags(post) {
  return post
    .split(" ")
    .map((post) => {
      return post.startsWith("#") ? `<a href="#">${post}</a>` : post;
    })
    .join(" ");
}
