import React from 'react';
import DownloadChartImg from '../../../assets/images/quotePageDownload.svg';

const DownloadChartButton = (props) => {
    return(
        <div>
            <button onClick={ () => { props.sendData() } }>
                <img src={DownloadChartImg} />
            </button>
        </div>
    );
}

export default DownloadChartButton;