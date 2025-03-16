export default function toLogin({ redirect }) {
  return `/login${redirect ? `?redirect=${redirect}` : ""}`;
}
