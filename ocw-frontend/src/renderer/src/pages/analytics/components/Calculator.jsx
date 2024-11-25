import React, { useState } from 'react'
import LabelInput from './LabelInput'
import Button from './Button'
import ResultDisplay from './ResultDisplay'

export default function Calculator() {
  const [activeTab, setActiveTab] = useState('#future-value')

  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [time, setTime] = useState('')
  const [compounds, setCompounds] = useState('')
  const [futureValue, setFutureValue] = useState(null)
  const [contribution, setContribution] = useState('')
  const [results, setResults] = useState('')

  const [downPayment, setDownPayment] = useState('')
  const [annualRate, setAnnualRate] = useState('')
  const [years, setYears] = useState('')
  const [propertyTaxes, setPropertyTaxes] = useState('')
  const [annualInsurance, setAnnualInsurance] = useState('')
  const [otherTaxes, setOtherTaxes] = useState('')

  const tabs = [
    { title: 'Future Value', targetId: '#future-value' },
    { title: 'Loan', targetId: '#loan-amortization' },
    { title: 'Saving', targetId: '#savings-plan' },
    { title: 'Mortgage', targetId: '#mortgage-calculator' },
    { title: 'Investment', targetId: '#investment-return' }
  ]

  const handleTabClick = (targetId) => {
    setActiveTab(targetId)
  }

  const handleValueCalculation = () => {
    const principalAmount = parseFloat(principal)
    const annualRate = parseFloat(rate) / 100
    const timeYears = parseFloat(time)
    const compoundingFrequency = parseInt(compounds)
    const calculatedFutureValue =
      principalAmount *
      Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency * timeYears)
    setFutureValue(Math.round(calculatedFutureValue))
  }

  const handleLoanCalculation = () => {
    const loanPrincipal = parseFloat(principal) || 0
    const monthlyRate = parseFloat(rate) / 100 / 12 || 0
    const months = (parseFloat(time) || 0) * 12
    if (loanPrincipal <= 0 || monthlyRate <= 0 || months <= 0) {
      setResults('Please, enter valid values and positive in all fields .')
      return
    }
    const payment =
      (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    const totalPayment = payment * months
    const interestAmount = totalPayment - loanPrincipal
    setResults(
      `Monthly EMI: $${Math.round(payment)}\nTotal Amount Payable: $${Math.round(totalPayment)}\nInterest Amount: $${Math.round(interestAmount)}`
    )
  }

  const handleSavingsCalculation = () => {
    const initialPrincipal = parseFloat(principal) || 0
    const annualRate = parseFloat(rate) / 100 || 0
    const years = parseFloat(time) || 0
    const annualContribution = parseFloat(contribution) || 0
    if (initialPrincipal <= 0 || annualRate <= 0 || years <= 0 || annualContribution < 0) {
      setResults('Please, enter valid values and positive in all fields .')
      return
    }
    const futureValue =
      initialPrincipal * Math.pow(1 + annualRate, years) +
      annualContribution * ((Math.pow(1 + annualRate, years) - 1) / annualRate)
    const interestEarned = futureValue - initialPrincipal - annualContribution * years
    setResults(
      `Total Savings: $${Math.round(futureValue)}\nInterest Earned: $${Math.round(interestEarned)}`
    )
  }

  const handleMortgageCalculation = () => {
    const loanPrincipal = parseFloat(principal) || 0
    const downPaymentAmount = parseFloat(downPayment) || 0
    const annualInterestRate = parseFloat(annualRate) / 100 || 0
    const loanYears = parseFloat(years) || 0
    const propertyTaxAnnual = parseFloat(propertyTaxes) || 0
    const insuranceAnnual = parseFloat(annualInsurance) || 0
    const otherTaxesAnnual = parseFloat(otherTaxes) || 0
    const loanAmount = loanPrincipal - downPaymentAmount
    if (loanAmount <= 0) {
      setResults('The down payment cannot be greater or equal to the loan amount.')
      return
    }
    const monthlyRate = annualInterestRate / 12
    const numberOfPayments = loanYears * 12
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    const monthlyPropertyTaxes = propertyTaxAnnual / 12
    const monthlyInsurance = insuranceAnnual / 12
    const totalMonthlyPayment = monthlyPayment + monthlyPropertyTaxes + monthlyInsurance
    const totalPayment = totalMonthlyPayment * numberOfPayments
    const totalAnnualPropertyTaxes = propertyTaxAnnual * loanYears
    const totalAnnualInsurance = insuranceAnnual * loanYears
    const totalAnnualOtherTaxes = otherTaxesAnnual * loanYears
    const totalCostIncludingTaxes = totalPayment + totalAnnualOtherTaxes
    const interestAmount = totalPayment - loanAmount
    setResults(
      `Mensual Coute: $${Math.round(totalPagoMensual)}{\nTotal Import to pay: $${Math.round(totalCosteIncluidosImpuestos)}{\nImport of Interest: $${Math.round(interestAmount)}`
    )
  }

  const handleInvestmentCalculation = () => {
    const investmentPrincipal = parseFloat(principal) || 0
    const annualRate = parseFloat(rate) / 100 || 0
    const investmentTime = parseFloat(time) || 0
    if (investmentPrincipal <= 0 || annualRate <= 0 || investmentTime <= 0) {
      setResults('Please, enter valid values and positive in all fields .')
      return
    }
    const futureValue = investmentPrincipal * Math.pow(1 + annualRate, investmentTime)
    const profitAmount = futureValue - investmentPrincipal
    setResults(
      `Total return: $${Math.round(futureValue)}\Beneficiary Import: $${Math.round(profitAmount)} }`
    )
  }

  const tabClasses =
    'flex-1 text-center p-2.5 cursor-pointer transition-colors duration-300 border-b-2 border-transparent hover:bg-gray-200'

  return (
    <div className="flex justify-center items-center text-gray-800 m-0 p-5 mt-5">
      <div className="bg-white rounded-lg shadow-md max-w-[800px] w-full p-[30px] max-h-[70vh] overflow-y-auto">
        <h1 className="text-center text-gray-800 text-2xl mb-5">Financial Calculator</h1>
        <div className="flex border-b-2 border-gray-300 mb-5 ">
          {tabs.map((tab) => (
            <div
              key={tab.targetId}
              className={`${tabClasses} ${activeTab === tab.targetId ? 'border-[#1976d2] text-[#1976d2]' : ''}`}
              data-target={tab.targetId}
              onClick={() => handleTabClick(tab.targetId)}
            >
              {tab.title}
            </div>
          ))}
        </div>
        {activeTab === '#future-value' && (
          <div id="future-value">
            <LabelInput
              label="Principal Import"
              id="principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Annul Interest rate (%)"
              id="rate"
              value={rate}
              onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Time (years)"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Compund per year"
              id="compounds"
              value={compounds}
              onChange={(e) => setCompounds(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <Button
              id="call-future-value"
              text="Caculate future value"
              onClick={handleValueCalculation}
            />
            {futureValue !== null && (
              <ResultDisplay id="result-future-value" text={`Future Value: $${futureValue}`} />
            )}
          </div>
        )}
        {activeTab === '#loan-amortization' && (
          <div id="loan-amortization">
            <LabelInput
              label="Loan amount"
              id="loan-principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Annual interest year (%)"
              id="loan-rate"
              value={rate}
              onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Time (years)"
              id="loan-time"
              value={time}
              onChange={(e) => setTime(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <Button
              id="calculate-loan"
              text="Calculate loan payment"
              onClick={handleLoanCalculation}
            />
            {results && (
              <ResultDisplay id="result-loan-payment" text={results.replace(/\n/g, '<br />')} />
            )}
          </div>
        )}
        {activeTab === '#savings-plan' && (
          <div id="savings-plan">
            <LabelInput
              label="Initial savings"
              id="savings-principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Annual interest rate (%)"
              id="savings-rate"
              value={rate}
              onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Time (years)"
              id="savings-time"
              value={time}
              onChange={(e) => setTime(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Annual contribution"
              id="savings-contribution"
              value={contribution}
              onChange={(e) => setContribution(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <Button
              id="calculate-savings"
              text="Calculate savings"
              onClick={handleSavingsCalculation}
            />
            {results && (
              <ResultDisplay id="result-savings" text={results.replace(/\n/g, '<br />')} />
            )}
          </div>
        )}
        {activeTab === '#mortgage-calculator' && (
          <div id="mortgage-calculator">
            <LabelInput
              label="Mortgage loan"
              id="mortgage-amount"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Down payment"
              id="down-payment"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Annual interest rate(%)"
              id="mortgage-rate"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Loan place (years)"
              id="mortgage-time"
              value={years}
              onChange={(e) => setYears(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Property Tax (Annual)"
              id="property-taxes"
              value={propertyTaxes}
              onChange={(e) => setPropertyTaxes(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Annual insurance"
              id="insurance"
              value={annualInsurance}
              onChange={(e) => setAnnualInsurance(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Other taxes (Annual)"
              id="other-taxes"
              value={otherTaxes}
              onChange={(e) => setOtherTaxes(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <Button
              id="calculate-mortgage"
              text="Calculate mortgage"
              onClick={handleMortgageCalculation}
            />
            {results && (
              <ResultDisplay id="result-mortgage" text={results.replace(/\n/g, '<br />')} />
            )}
          </div>
        )}
        {activeTab === '#investment-return' && (
          <div id="investment-return">
            <LabelInput
              label="Amount of the investment"
              id="investment-principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Annual interest rate (%)"
              id="investment-rate"
              value={rate}
              onChange={(e) => setRate(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <LabelInput
              label="Time (years)"
              id="investment-time"
              value={time}
              onChange={(e) => setTime(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <Button
              id="calculate-investment"
              text="Calculate investment return"
              onClick={handleInvestmentCalculation}
            />
            {results && (
              <ResultDisplay id="result-investment" text={results.replace(/\n/g, '<br />')} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
