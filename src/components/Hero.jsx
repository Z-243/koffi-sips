// tells the user why they should use this app
export default function Hero() {
  return (
    <>
      <h1>
        For Coffee{" "}
        <abbr title="A true connoisseur or passionate enthusiast">
          Aficionados
        </abbr>
        <span role="img" aria-label="coffee cup" className="coffee-emoji">
          {" "}
          ☕️
        </span>
      </h1>
      <div className="benefits-list modern-benefits">
        <h3 className="font-bolder">
          <span className="text-gradient">Koffi Sips</span>: Elevate your daily
          ritual
          <ul>
            <li>
              <span className="benefit-icon">📔</span>
              Chronicle every cup—from bold espressos to dreamy lattes
            </li>
            <li>
              <span className="benefit-icon">⚡️</span>
              Reveal your real-time caffeine flow and energy arc
            </li>
            <li>
              <span className="benefit-icon">💸</span>
              Track your spending and savor your coffee history
            </li>
          </ul>
        </h3>
      </div>

      <div className="card info-card">
        <div>
          <i className="fa-solid fa-circle-info"></i>
          <h3>Did you know...</h3>
        </div>
        <h5>That caffeine&apos;s half-life is about 5 hours</h5>
        <p>
          Sip on this: five hours after your favorite brew, half that caffeine
          is still coursing through your veins, fueling your focus and keeping
          your senses sharp. Down a 200 mg cup? Even after five hours, you’re
          still riding a 100 mg wave—proof that your coffee’s power lingers long
          after the last drop!
        </p>
      </div>
    </>
  );
}
