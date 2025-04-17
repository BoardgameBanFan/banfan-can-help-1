export default function objToQueryString(obj: object) {
  return (
    "?" +
    Object.keys(obj)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
      .join("&")
  );
}
