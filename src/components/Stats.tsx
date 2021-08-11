import React, { useState, useEffect } from "react";

function Stats() {
  return (
    <div className="row">
      <div className="block">
        <h4>Average EPS APY</h4>
        <hr />
        <p>159.49%</p>
      </div>
      <div className="block">
        <h4>Average BUSD APY</h4>
        <hr />
        <p>6.25%</p>
      </div>
      <div className="block">
        <h4>Inflation</h4>
        <hr />
        <p>250%</p>
      </div>
    </div>
  );
}

export default Stats;
