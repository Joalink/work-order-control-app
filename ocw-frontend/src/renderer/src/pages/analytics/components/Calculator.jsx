import React, {useState} from 'react';
import LabelInput from './LabelInput';
import Button from './Button';
import ResultDisplay from './ResultDisplay';

export default function Calculator() {

    const [activeTab, setActiveTab] = useState('#future-value');

    const tabs = [
        { title: 'Future Value', targetId: '#future-value' },
        { title: 'Loan', targetId: '#loan-amortization' },
        { title: 'Savings', targetId: '#savings-plan' },
        { title: 'Mortgage', targetId: '#mortgage-calculator' },
        { title: 'Investment', targetId: '#investment-return' },
    ];

    const handleTabClick = (targetId) => {
        setActiveTab(targetId);
    };

    const handleCalculate = () => {
        console.log('call future value');
    };

    const tabClasses = "flex-1 text-center p-2.5 cursor-pointer transition-colors duration-300 border-b-2 border-transparent hover:bg-gray-200";


    return (
        <div className="font-poppins bg-gray-100 text-gray-800 m-0 p-5 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-md max-w-[800px] w-full p-[30px]">
                <h1 className="text-center text-gray-800 text-2xl mb-5">Financial Calculator</h1>
                <div className='flex border-b-2 border-gray-300 mb-5'>
                    {tabs.map((tab) => (
                        <div
                            key={tab.targetId}
                            className={`${tabClasses} ${activeTab === tab.targetId ? 'border-blue-500 text-blue-500' : ''}`}
                            data-target={tab.targetId}
                            onClick={() => handleTabClick(tab.targetId)}
                        >
                        {tab.title}
                        </div>
                    ))}
                </div>
                {activeTab === '#future-value' && (
                    <div id="future-value" >
                        <LabelInput label="Principal Amount" id="principal"/>
                        <LabelInput label="Annual Interest Rate (%)" id="rate"/>
                        <LabelInput label="Time (Years)" id="time"/>
                        <LabelInput label="Compounds per Year" id="compounds"/>
                        <Button id="call-future-value" text="Calculate Future Value" onClick={handleCalculate}/>
                        <ResultDisplay id="result-future-value" text={`Future Value: `}/>
                    </div>
                )}

                {activeTab === '#loan-amortization' && (
                    <div id="loan-amortization" >
                        <LabelInput label="Loan Amount" id="loan-principal"/>
                        <LabelInput label="Annual Interest Rate (%)" id="loan-rate"/>
                        <LabelInput label="Time (Years)" id="loan-time"/>
                        <Button id="calculate-loan" text="Calculate Loan Payment" onClick={handleCalculate}/>
                        <ResultDisplay id="result-loan-payment" text={`Monthly EMI: $0<br/>Total Amount Payable: $0<br/>Interest Amount: $0`}/>
                    </div>
                    
                )}

                {activeTab === '#savings-plan' && (
                    <div id="savings-plan" >
                        <LabelInput label="Initial Savings" id="savings-principal"/>
                        <LabelInput label="Annual Interest Rate (%)" id="savings-rate"/>
                        <LabelInput label="Time (Years)" id="savings-time"/>
                        <LabelInput label="Annual Contribution" id="savings-contribution"/>
                        <Button id="calculate-savings" text="Calculate Savings" onClick={handleCalculate}/>
                        <ResultDisplay id="result-savings" text={`Total Savings: $0<br/>Interest Earned: $0`}/>
                    </div>
                )}

                {activeTab === '#mortgage-calculator' && (
                    <div id="mortgage-calculator">
                        <LabelInput label="Mortgage Amount" id="mortgage-amount"/>
                        <LabelInput label="Down Payment (Optional)" id="down-payment"/>
                        <LabelInput label="Annual Interest Rate (%)" id="mortgage-rate"/>
                        <LabelInput label="Time (Years)" id="mortgage-time"/>
                        <LabelInput label="Property Taxes per Year (Optional)" id="property-taxes"/>
                        <LabelInput label="Homeowners Insurance per Year (Optional)" id="insurance"/>
                        <LabelInput label="Other Taxes per Year (Optional)" id="other-taxes"/>
                        <Button id="calculate-mortgage" text="Calculate Mortgage Payment" onClick={handleCalculate}/>
                        <ResultDisplay id="result-mortgage" text={`Monthly Payment: $0<br/>Total Mortgage Payable: $0<br/>Mortgage Interest: $0`}/>
                    </div>
                )}

                {activeTab === '#investment-return' && (
                    <div id="investment-return">
                        <LabelInput label="Investment Amount" id="investment-principal"/>
                        <LabelInput label="Annual Interest Rate (%)" id="investment-rate"/>
                        <LabelInput label="Time (Years)" id="investment-time"/>
                        <Button id="calculate-investment" text="Calculate Investment Return" onClick={handleCalculate}/>
                        <ResultDisplay id="result-investment" text={`Total Return: $0<br/>Profit Amount: $ `}/>
                    </div>
                )}





            </div>
        </div>
    )
}
