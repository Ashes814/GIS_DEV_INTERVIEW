import From from "./Form";
let statuses = ["empty", "typing", "submitting", "success", "error"];

export default function DocApp() {
  return (
    <>
      {statuses.map((status) => (
        <section key={status}>
          <h4>From ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
