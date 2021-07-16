import React, { useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

function App() {
  let id;
  const pdfExportComponent = useRef(null);
  const [layoutSelection, setLayoutSelection] = useState({
    text: "A4",
    value: "size-a4",
  });

  const ddData = [
    { text: "A4", value: "size-a4" },
    { text: "Letter", value: "size-letter" },
    { text: "Executive", value: "size-executive" },
  ];

  const [poid, setPoid] = useState();
  const [podocno, setPodocno] = useState();
  const [podate, setPodate] = useState();
  const [porevno, setPorevno] = useState();
  const [ponumber, setPonumber] = useState();
  const [poquotationref, setPoquotationref] = useState();
  const [poproject, setPoproject] = useState();
  const [popaymentmode, setPopaymentmode] = useState();
  const [povendor, setPovendor] = useState();
  const [pocode, setPocode] = useState();
  const [pophone, setPophone] = useState();
  const [pocpperson, setPocpperson] = useState();
  const [pomobile, setPomobile] = useState();
  const [poemail, setPoemail] = useState();
  const [povat, setPovat] = useState();
  const [poadd, setPoadd] = useState();
  const [postartdate, setPostartdate] = useState();
  const [poenddate, setPoenddate] = useState();
  const [polocation, setPolocation] = useState();
  const [pomobilizationdate, setPomobilizationdate] = useState();
  const [podesc, setPodesc] = useState();
  const [pototal, setPototal] = useState(0);
  const [pogst, setPogst] = useState(0);
  const [pograndtotal, setPograndtotal] = useState(0);

  const [myDataSet, setMyDataSet] = useState([]);

  const [instruction, setInstruction] = useState(
    "1. Payment shall be made for the quantities executed as per unit rates given above. \n2. Work Order number and date must be quoted on all correspondence. \n3. This order is subject to the terms and conditions set out on the face and Annexure -A \n4. The acceptance copy must be signed by vender or by its representative ( on vender’s behalf) on the face and Annexure - A \n 5. This Work Order is subject to the cancellation unless the subcontractor returns one copy signed with confirmation that all terms and conditions are accepted. \n 6. The following attachments form an integral part of this work Order."
  );
  const [deliveryTerms, setDeliveryTerms] = useState(
    "1. Lubricants, top-up oil, repairs, daily maintenance, Service and Consumables of the Equipments shall be provide by Vender. \n2. In case of breakDown or Maintenance, Vwndor/Supplier shall provide a replacement of equipment immediatly at no extra cost."
  );
  const [conditionTerms, setConditionTerms] = useState(
    "1. Above rate is applicable for 10 hours per day, 6 days a week, 260 hours per Month. \n2. Working Duration: 2 Month Extandable. \n3. Supply Food, accommodation & Transportation scope Entema al-shamal. \n4. Above Rate is exclusive of VAT. \n5. If you need any clarification on above matter or any assistance please feel free to contract undersigned. \n6. Vendor has to return the same purchase order to Entema Al-shamal by Fax or Email after Confirmation Signature."
  );

  const [sigName, setSigName] = useState();
  const [sigNameNTitle, setSigNameNTitle] = useState();

  const handleExportWithComponent = (event) => {
    console.log("my props id value : ", id);

    axios
      .post("http://localhost:3009/getPOMULDataonID", {
        POID: id,
      })
      .then((response) => {
        {
          console.log("My API data : ", response.data);

          if (response) {
            setMyDataSet(response.data);

            setPoid(response.data[0].PO_ID);
            setPodocno(response.data[0].DOC_NO);
            setPodate(response.data[0].CREATED_DATE);
            setPorevno(response.data[0].REV_NO);
            setPonumber(response.data[0].WO_NUMBER);
            setPoquotationref(response.data[0].WO_QUO_REF);
            setPoproject(response.data[0].WO_PROJECT);
            setPopaymentmode(response.data[0].WO_PAYMENT_MODE);
            setPovendor(response.data[0].VI_VENDOR);
            setPocode(response.data[0].VI_CODE);
            setPophone(response.data[0].VI_PH_NO);
            setPocpperson(response.data[0].VI_CONTACT_PERSON);
            setPomobile(response.data[0].VI_MOBILE);
            setPoemail(response.data[0].VI_EMAIL);
            setPovat(response.data[0].VI_VAT);
            setPoadd(response.data[0].VI_ADDRESS);
            setPostartdate(response.data[0].WS_START_DATE);
            setPoenddate(response.data[0].WS_END_DATE);
            setPolocation(response.data[0].WS_LOC);
            setPomobilizationdate(response.data[0].WS_MOB_DATE);
            setPodesc(response.data[0].WS_DESC);
            setPototal(response.data[0].PO_TOTAL);
            setPogst(response.data[0].PO_GST);
            setPograndtotal(response.data[0].PO_GRANDTOTAL);
            setInstruction(response.data[0].PO_INSTRUCTION);
            setDeliveryTerms(response.data[0].PO_TOD);
            setConditionTerms(response.data[0].PO_TC);
          }
          // setTimeout(() => {
          //     pdfExportComponent.current.save();
          // }, 2000);
        }
      });
  };

  var th = ["", "thousand", "million", "billion", "trillion"];
  var dg = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  var tn = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  var tw = [
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const toWords = (s) => {
    s = s.toString();
    s = s.replace(/[\, ]/g, "");
    if (s != parseFloat(s)) return "not a number";
    var x = s.indexOf(".");
    if (x == -1) x = s.length;
    if (x > 15) return "too big";
    var n = s.split("");
    var str = "";
    var sk = 0;
    for (var i = 0; i < x; i++) {
      if ((x - i) % 3 == 2) {
        if (n[i] == "1") {
          str += tn[Number(n[i + 1])] + " ";
          i++;
          sk = 1;
        } else if (n[i] != 0) {
          str += tw[n[i] - 2] + " ";
          sk = 1;
        }
      } else if (n[i] != 0) {
        // 0235
        str += dg[n[i]] + " ";
        if ((x - i) % 3 == 0) str += "hundred ";
        sk = 1;
      }
      if ((x - i) % 3 == 1) {
        if (sk) str += th[(x - i - 1) / 3] + " ";
        sk = 0;
      }
    }

    if (x != s.length) {
      var y = s.length;
      str += "point ";
      for (var i = x + 1; i < y; i++) str += dg[n[i]] + " ";
    }
    return str.replace(/\s+/g, " ").toUpperCase();
  };

  const updatePageLayout = (event) => {
    setLayoutSelection(event.target.value);
  };
  const printDocument = () => {
    const input = document.getElementById("divToPrint");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.output("dataurlnewwindow");
      pdf.save("download.pdf");
    });
  };

  return (
    <div>
      <div className="mb5" value={layoutSelection} onChange={updatePageLayout}>
        <button onClick={printDocument}>Print</button>
      </div>
      <div id="divToPrint" className="mt4">
        <div className="pdf-page">
          <div className="col-sm-12 print-div">
            <div className="print-quot">
              <div className="row">
                <div className="col-sm-3 logo-div">
                  <img src="logo.png" style={{ width: "100%" }} alt="logo" />
                </div>
                <div className="col-sm-4 print-quot1">
                  <h4>PURCHASE ORDER</h4>
                </div>

                <div className="print-quot6">
                  <div className="row">
                    <div className="col-sm-5 col-xs-4 pt-left">Doc No</div>
                    <div className="col-sm-7 col-xs-8 pt-right">{podocno}</div>
                  </div>

                  <div className="row">
                    <div className="col-sm-5 col-xs-4 pt-left">Date</div>
                    <div className="col-sm-7 col-xs-8 pt-right">{podate}</div>
                  </div>

                  <div className="row">
                    <div className="col-sm-5 col-xs-4 pt-left">Rev. No</div>
                    <div className="col-sm-7 col-xs-8 pt-right">{porevno}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row print-detail">
            <div className="col-sm-6 left1">
              <div className="print-detail1">
                <h5 style={{ fontSize: "14px", textAlign: "left" }}>
                  Invoice To
                </h5>
                <h1>Entema Al Shamal Gen. cont. Est</h1>
                <p>
                  Al-Jubail St P.O. Box 2816, Jubail 31951, Saudi Arabia
                  <br />
                  <strong>Phone:</strong> 013 363 1210
                  <br />
                  <strong>Email:</strong> info@entema-sa.com
                  <br />
                  <strong>VAT No:</strong> 310005823700003
                </p>
              </div>
            </div>

            <div className="col-sm-6 right1">
              <div className="print-detail3 pd3">
                <h1>Work Order</h1>
                <div className="row pd8-det">
                  <div className="col-sm-5 left1">
                    <div className="row">
                      <div className="col-sm-7 pri-field-head">Number</div>
                      <div className="col-sm-5 pri-field-data pon">
                        {ponumber}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-7 pri-field-head">Project</div>
                      <div className="col-sm-5 pri-field-data">{poproject}</div>
                    </div>
                  </div>

                  <div className="col-sm-7 right1">
                    <div className="row">
                      <div className="col-sm-7 pri-field-head">
                        Quatation Ref
                      </div>
                      <div className="col-sm-5 pri-field-data">
                        {poquotationref}
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-12">
                    <div className="row">
                      <div className="col-sm-6 pri-field-head">
                        Mode / Terms Payment
                      </div>
                      <div className="col-sm-6 pri-field-data">
                        {popaymentmode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row" style={{ marginTop: "10px" }}>
            <div className="col-sm-8 left1">
              <div className="print-vendor">
                <div className="row">
                  <div className="col-sm-8 left1">
                    <div className="row ven-row">
                      <div className="col-sm-4 pri-field-head pv3">Vendor</div>
                      <div
                        className="col-sm-8 pri-field-data p-data"
                        style={{ fontSize: "13px", fontWeight: "500" }}
                      >
                        {povendor}
                      </div>
                    </div>
                  </div>

                  <br />
                  <div className="col-sm-4 right1">
                    <div className="row pvc">
                      <div className="col-sm-6 pri-field-head">Code</div>
                      <div className="col-sm-6 pri-field-data p-data1">
                        {pocode}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <div className="row pv2">
                      <div className="col-sm-3 pri-field-head">Address</div>
                      <div className="col-sm-9 pri-field-data">{poadd} </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-5 left1">
                    <div className="row">
                      <div className="col-sm-6 pri-field-head pv4">Ph</div>
                      <div className="col-sm-6 pri-field-data">{pophone}</div>
                    </div>
                  </div>

                  <div className="col-sm-7 right1">
                    <div className="row">
                      <div className="col-sm-7 pri-field-head">
                        Contact Person
                      </div>
                      <div className="col-sm-5 pri-field-data">
                        {pocpperson}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-5 left1">
                    <div className="row">
                      <div className="col-sm-5 pri-field-head pv4">Mobile</div>
                      <div className="col-sm-7 pri-field-data">{pomobile}</div>
                    </div>
                  </div>

                  <div className="col-sm-7 right1">
                    <div className="row">
                      <div className="col-sm-3 pri-field-head">VAT</div>
                      <div className="col-sm-9 pri-field-data">{povat}</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-7 left1">
                    <div className="row">
                      <div className="col-sm-5 pri-field-head pv1">Email</div>
                      <div className="col-sm-7 pri-field-data">{poemail}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 right1">
              <div className="print-detail5 pd3a">
                <h1>Work Schedule</h1>

                <div className="pvw">
                  <div className="row">
                    <div className="col-sm-6 pri-field-head">Start</div>
                    <div className="col-sm-6 pri-field-data">{postartdate}</div>
                  </div>

                  <div className="row">
                    <div className="col-sm-6 pri-field-head">Completion</div>
                    <div className="col-sm-6 pri-field-data">{poenddate}</div>
                  </div>

                  <div className="row">
                    <div className="col-sm-6 pri-field-head">Location</div>
                    <div className="col-sm-6 pri-field-data">{polocation} </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="dash-pr">
                <div className="row">
                  <div className="col-sm-3 pri-field-head">
                    Description of Work
                  </div>
                  <div className="col-sm-9 pri-field-data">{podesc}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="print-table9">
                <table>
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Description </th>
                      <th> Unit</th>
                      <th>QTY</th>
                      <th>Unit rate (Sar)</th>
                      <th>Amount (sar)</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDataSet.map((comment, index) => (
                      <tr>
                        <th scope="row" key={index}>
                          {comment.PO_ROW + 1}
                        </th>
                        <td>{comment.PO_DESC}</td>
                        <td>{comment.UNIT_DD}</td>
                        <td>{comment.QUANTITY}</td>
                        <td>{comment.UNIT_RATE}</td>
                        <td>{comment.UNIT_AMOUNT}</td>
                        <td>NA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="row mt-2">
                <div className="col-sm-5 pri-field-head">Mobilization Date</div>
                <div className="col-sm-7 ">{pomobilizationdate}</div>
              </div>
            </div>

            <div className="col-6">
              <div className="print-total row mr-0">
                <div className="col-6 tot-left tl1">TOTAL sar</div>
                <div className="col-6 tot-right tr1" id="total">
                  {pototal}
                </div>

                <div className="col-6 col-xs-6 tot-left">
                  s.tAX/vat/rgst {pogst} %
                </div>
                <div className="col-6 col-xs-6 tot-right">{pogst} </div>
                <div className="col-sm-6 col-xs-6 tot-left tl2">
                  gRAND tOTAL (sAR)
                </div>
                <div
                  className="col-sm-6 col-xs-6 tot-right tr2"
                  id="grandtotal"
                >
                  {pograndtotal}
                </div>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="print-total7">
                <h4>
                  <span>
                    TOTAL (IN WORDS ):
                    <span id="total_word" style={{ display: "inline" }}></span>
                    SAR{" "}
                    <span
                      id="total_decimal"
                      style={{ display: "inline" }}
                    ></span>
                    Only
                  </span>
                </h4>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="dash-terms mt-0 pt-0">
                <h1 className="pl-0">INSTRUCTIONS:</h1>
                <p>{instruction}</p>
              </div>
            </div>

            <div className="col-sm-12">
              <div className="dash-terms mt-0 pt-0">
                <h1 className="pl-0">Terms of delivery:</h1>
                <p>{deliveryTerms}</p>
              </div>
            </div>

            <div className="col-sm-12">
              <div className="dash-terms mt-0 pt-0">
                <h1 className="pl-0">Terms &amp; Conditions:</h1>
                <p>{conditionTerms}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12" style={{ maxWidth: "97%" }}>
              <div className="bot-cl5">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="bot-cl6">
                      <h1>Accepted by</h1>
                      <div className="row">
                        <div className="col-sm-5 col-xs-6 bot-left">
                          Signature
                        </div>
                        <div className="col-sm-7 col-xs-6 bot-right">
                          {sigName}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-5 col-xs-6 bot-left">
                          Name &amp; Title
                        </div>
                        <div className="col-sm-7 col-xs-6 bot-right">
                          {sigNameNTitle}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-5 col-xs-6 bot-left">Date</div>
                        <div className="col-sm-7 col-xs-6 bot-right">
                          {podate}
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-sm-12"
                          style={{ textAlign: "center", fontSize: "13px" }}
                        >
                          {sigName}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="bot-cl10">
                      <h1>Issued by</h1>
                      <h5>
                        Authorised Signatory
                        <br />
                        (Entema Al Shamal Gen. cont. Est)
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
