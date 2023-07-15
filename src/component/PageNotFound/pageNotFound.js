import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import "./PageNotFound.scss";

const PageNotFound = () => {
  useEffect(() => {
    const scrollRemove = document.getElementById("mySidenav");
    scrollRemove.style.display = "none";
  }, [])
  return (
    <React.Fragment>
      <div className="pagenotfound">
        <h1>404</h1>
        <div className="content-type-01">
          <h5><FormattedMessage id="pagenotfound" /></h5>
          <p><FormattedMessage id="deepandwide" /> <br />
            <FormattedMessage id="cantfindpage" /></p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.assign('/')}><FormattedMessage id="backtohome" /></button>
      </div>
    </React.Fragment>
  );
}
export default PageNotFound 