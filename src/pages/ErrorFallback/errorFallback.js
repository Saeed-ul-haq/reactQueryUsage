import jazzlogo from "assets/images/JazzLogo.png";
export const errorFallback = () => {
  return (
    <div className="fallback-view">
      <img src={jazzlogo} alt="Jazz Logo" />
      <h3>Something Went Wrong</h3>
      <h5>The browser crashed unexpectedly</h5>
      <a onClick={() => window.location.href=''}>Go to homePage</a>
    </div>
  );
};
