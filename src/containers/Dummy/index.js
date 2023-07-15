/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import Form from "react-bootstrap/Form";

function Dummy() {
  const [checked, setChecked] = useState(false);
  const handleToggle = (e) => {
    setChecked(e.target.checked);
  };

  console.log(checked);

  return (
    <React.Fragment>
      <div className="coming-main text-2xl">
        {/* <p className="coming-text">Coming Soon !</p> */}
        <Form>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Language Switch"
            checked={checked}
            onChange={(e) => handleToggle(e)}
            className="mb-4"
          />
        </Form>
        {checked ? (
          <>
            <p>【【BreakingDown NFTのフリーミント開催延期のお知らせ】</p>
            <p className="w-50 text-justify">
              現在イーサリアムのガス代が非常に高騰しており、平均的なコストよりも約3-4倍ほど高騰しております。そのためXANA:
              GENESISのコントラクト移行と同様に、フリーミントの開催を延期することにいたしました。
            </p>
            <p className="w-50 text-justify">
              市況を見ながらタイミングで開催いたしますので、追って公式からのアナウンスをお待ちいただけますと幸いです。
              直前の変更にてご迷惑をお掛け致しますが、何卒ご理解のほどよろしくお願いいたします。
            </p>
          </>
        ) : (
          <>
            <p>【Notice of postponement of BreakingDown NFT’s free mint】</p>
            <p className="w-50 text-justify">
              Due to the significant increase in Ethereum gas fees, which are
              currently about 3-4 times higher than the average cost, we have
              decided to postpone the free mint event, similar to the contract
              migration for XANA: GENESIS.{" "}
            </p>
            <p className="w-50 text-justify">
              We will announce the new timing for the event while monitoring the
              market conditions, so we kindly ask for your patience for the
              official announcement to follow.{" "}
            </p>
            <p className="w-50 text-justify">
              We apologize for any inconvenience caused by this last-minute
              change and appreciate your understanding.
            </p>
          </>
        )}
      </div>
    </React.Fragment>
  );
}

export default injectIntl(withRouter(Dummy));
