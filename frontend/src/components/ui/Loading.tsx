import "../../assets/styles/components/ui/Loading.css"

function Loading(): JSX.Element {
  return <div className="loader">
      <span className="loader-spinner"></span>
      <p>Please wait a little bit ...</p>
      <p>We are pulling the data to display.</p>
    </div>;
}

export default Loading;
