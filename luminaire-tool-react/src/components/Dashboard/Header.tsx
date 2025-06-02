
export default function Header() {
  return (
    <div className="text-center mb-xxl">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-sm tracking-tight">
        Luminaire GWP & Cost Assessment Tool
      </h1>
      <div className="text-text-secondary text-sm md:text-base font-medium">
        <span>Developer: </span>
        <a 
          href="mailto:dimitrios@electrolight.com" 
          className="text-metric-blue hover:underline transition-colors"
        >
          Dimitrios Tsiokaras - dimitrios@electrolight.com
        </a>
      </div>
    </div>
  );
}