import { ListGroupItem } from "reactstrap";
import SkeletonText from "../../../component/Card/SkeletonText";
import Skeleton, { SkeletonTheme }  from "react-loading-skeleton";


function loadingCardJsonComponents () {
    return(
        <ListGroupItem className="SkeletonTheme-collectation-wrap awardSkeletonUI" >
          <div className="SkeletonTheme-collectation">
            <SkeletonTheme color="#D0D0D0" highlightColor="#D8D8D8">
              <div className="loading-cd awardSkeletonImg " id="resize-image">
                <Skeleton  width={274} borderRadius={10} />
              </div>
              <div className="loading-center-text pt-3 awardSkeletonTitle">
                <SkeletonText color="#fff" />
              </div>
              <div className="d-flex justify-content-between px-2">
                <div className="one awardSkeletonSubTxt ">
                  <SkeletonText color="#fff" />
                </div>
                <div className="one awardSkeletonSubTxt">
                  <SkeletonText color="#fff" />
                </div>
              </div>
              <div className="loading-footer">
                <div className="one">
                  <Skeleton height={25} width={25} borderRadius={10} />
                </div>                
                <div className="one">
                  <SkeletonText width={86} color="#fff" />
                </div>
              </div>
            </SkeletonTheme>
          </div>
        </ListGroupItem>
      
    )
}

export default loadingCardJsonComponents;