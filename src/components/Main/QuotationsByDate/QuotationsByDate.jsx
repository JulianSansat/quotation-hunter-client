import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { moment as TimeFormat } from "moment";
import Api from "../../../services/api";
import { formatCurrency, formatPercent } from "../../../util/CurrencyFormat";
import "moment/locale/pt-br";
import "./QuotationsByDate.scss";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotations: {},
      loading: false,
      error: false,
      lastMonthSelected: "",
      lastWeekSelected: "",
      lastDaySelected: "is-info is-active",
      currencies: ["USD", "EUR"],
      criptos: ["BTC"],
      currenciesChartData: {},
      cryptoChartData: {}
    };
  }

  componentDidMount() {
    this.loadQuotations("yesterday");
  }

  loadQuotations = moment => {
    Api.get(`/quotations`, { params: { moment } })
      .then(res => {
        if (res.status === 200) {
          const { quotations } = res.data;
          const datasets = [];
          const criptoDataSets = [];
          let labels = [];
          let data = [];
          let chartItem = [];

          const colors = {
            BTC: ["rgba(255,217,102,0.4)", "rgba(255,204,0,1)"],
            USD: ["rgba(102,255,102,0.4)", "rgba(51,204,51,1)"],
            EUR: ["rgba(102,179,255,0.4)", "rgba(0,191,255,1)"]
          };

          Object.keys(quotations).map(currency => {
            labels = [];
            quotations[currency].quotations.map(quotation => {
              data.push(quotation.buy / 1000000);
              labels.push(quotation.created_at);
            });
            let color1 = "rgba(75,192,192,0.4)";
            let color2 = "rgba(75,192,192,1)";
            if (typeof colors[currency] !== "undefined") {
              color1 = colors[currency][0];
              color2 = colors[currency][1];
            }
            const label = `${currency} ${formatPercent(
              quotations[currency].variation
            )}%`;
            chartItem = {
              label,
              fill: false,
              lineTension: 0.1,
              backgroundColor: color1,
              borderColor: color2,
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: color2,
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: color2,
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data
            };
            if (this.state.currencies.includes(currency)) {
              datasets.push(chartItem);
            }
            if (this.state.criptos.includes(currency)) {
              criptoDataSets.push(chartItem);
            }
            data = [];
          });
          const currenciesChartData = { labels, datasets };
          const cryptoChartData = { labels, datasets: criptoDataSets };
          this.setState({
            currenciesChartData,
            cryptoChartData,
            loading: false
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          error: true
        });
      });
  };

  selectMoment = moment => {
    let lastMonthSelected = "";
    let lastWeekSelected = "";
    let lastDaySelected = "";
    if (moment === "yesterday") {
      lastDaySelected = "is-info is-active";
    }
    if (moment === "last_week") {
      lastWeekSelected = "is-info is-active";
    }
    if (moment === "last_month") {
      lastMonthSelected = "is-info is-active";
    }
    this.setState({
      lastDaySelected,
      lastWeekSelected,
      lastMonthSelected
    });
    this.loadQuotations(moment);
  };

  render() {
    const {
      quotations,
      loading,
      lastMonthSelected,
      lastWeekSelected,
      lastDaySelected,
      currenciesChartData,
      cryptoChartData
    } = this.state;
    if (loading === true) {
      return <p>Loading...</p>;
    }
    return (
      <div className="section">
        <div className="buttons has-addons">
          <div style={{ margin: "auto" }}>
            <span
              className={`button ${lastMonthSelected}`}
              onClick={() => this.selectMoment("last_month")}
            >
              Mês passado
            </span>
            <span
              className={`button ${lastWeekSelected}`}
              onClick={() => this.selectMoment("last_week")}
            >
              Última semana
            </span>
            <span
              className={`button ${lastDaySelected}`}
              onClick={() => this.selectMoment("yesterday")}
            >
              Ontem
            </span>
          </div>
        </div>
        <div>
          <Line data={currenciesChartData} width={400} />
        </div>
        <div>
          <Line data={cryptoChartData} width={400} />
        </div>
      </div>
    );
  }
}

export default NavBar;
