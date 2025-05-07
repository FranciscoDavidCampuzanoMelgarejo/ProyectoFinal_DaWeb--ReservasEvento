import '../styles/home_card.css';

export function HomeCard({ titulo, contenido, children }) {
  return (
    <div className="homeInfo__card p-4 rounded-4 bg--primary-700">
      <div className="pb-1 clr--secondary-300">{children}</div>
      <h3 className="pb-3">{titulo}</h3>
      <p className="clr--neutral-500">{contenido}</p>
    </div>
  );
}
