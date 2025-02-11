/* 
✅ List of coins added by the user
✅ Input field to edit the amount owned
✅ Show total value for each coin
✅ Remove button
*/

export default function Portfolio({ myCoins }) {
  return (
    <>
      <h3>Balances (myCoins length)</h3>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Allocation</th>
            <th>Amount</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </>
  );
}
