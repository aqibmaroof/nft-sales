import React from 'react';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonText = ({ width }) => {
    return (
        <React.Fragment>
            <SkeletonTheme color="#D0D0D0" highlightColor="#D8D8D8">
                <Skeleton height={10} width={width ? width : 200} />
            </SkeletonTheme>
        </React.Fragment>
    )
}

export default SkeletonText;