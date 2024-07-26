export default function Error({ message, title }) {
  return (
    <div className="error">
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}
