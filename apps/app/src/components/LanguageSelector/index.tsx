import "./styles.css";
import { changeLocale } from "@actions";
import { useLocale } from "@context/LocaleContext";

const LanguageSelector = () => {
  const { dispatch } = useLocale();

  return (
    <div className="language-selector">
      <div
        className="language-icon"
        onClick={() => dispatch(changeLocale("ar"))}
        aria-label="Arabic"
      >
        <div className="svg-arabic flag"></div>
        <span>Arabic</span>
      </div>
      <div
        className="language-icon"
        onClick={() => dispatch(changeLocale("en"))}
        aria-label="English"
      >
        <div className="svg-english flag"></div>
        <span>English</span>
      </div>
    </div>
  );
};

export default LanguageSelector;
