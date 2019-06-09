import React, { Component } from "react";
import Api from "../../../services/api";
import { formatCurrency, formatPercent } from "../../../util/CurrencyFormat";
import "./NavBar.scss";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quotations: {},
      loading: true,
      error: false
    };
  }

  componentDidMount() {
    Api.get(`/preview`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            quotations: res.data.quotations,
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
  }

  render() {
    const { quotations, loading } = this.state;
    document.addEventListener("DOMContentLoaded", () => {
      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
      );

      if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
          el.addEventListener("click", () => {
            const { target } = el.dataset;
            const $target = document.getElementById(target);
            el.classList.toggle("is-active");
            $target.classList.toggle("is-active");
          });
        });
      }
    });
    if (loading === true) {
      return <p>Loading...</p>;
    }
    return (
      <nav className="level is-mobile nav-header">
        <div className="navbar-brand">
          <p className="brand-title title is-4">Últimas cotações</p>
        </div>
        {Object.keys(quotations).map(currency => (
          <div key={currency} className="level-item has-text-centered">
            <div>
              <p className="heading">{currency}</p>
              <p className="title price">
                {formatCurrency(quotations[currency].quotations.buy)}
              </p>
              <p className="variation">
                {quotations[currency].symbol === "+" ? (
                  <i className="fa fa-caret-up" aria-hidden="true" />
                ) : (
                  <i className="fa fa-caret-down" aria-hidden="true" />
                )}
                {formatPercent(quotations[currency].variation)}
%
              </p>
            </div>
          </div>
        ))}
      </nav>
    );
  }
}

export default NavBar;
