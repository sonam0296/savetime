import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { FormGroup, FormControlLabel, Switch, Grid, Button } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom';
import './PlanCenter.css'
import { useDispatch, useSelector } from 'react-redux';
import instance from '../../../axios';
import requests from '../../../requests';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { setWorkerLoginStatus } from '../../../redux/actions/actions';
import { successToaster } from '../../../common/common';
// import planHtml from './Plan.html'

const PlanCenter = () => {
    const { t } = useTranslation();
    const language = useSelector(state => state.language)
    const history = useHistory()
    const location = useLocation()
    const [on, setOn] = useState(true);
    const [flag, setFlag] = useState(false);
    const centerData = useSelector((state) => state.loginData)
    const [center, setCenter] = useState({
        name: centerData.name,
        centerId: centerData._id,
    })
    console.log(center.centerId)
    const [plan, setPlan] = useState([])
    const token = useSelector((state) => state.token)
    const [workerList, setWorkerList] = useState([])
    const dispatch = useDispatch()
    const [count, setCount] = useState([])
    const handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };
    const [forPayment, setForPayment] = useState(false);
    const [merchantParameters, setMerchantParameters] = useState("");
    const logincenterToken = useSelector(state => state.selectedLoginCenter.token)
    const [signature, setSignature] = useState("");
    const [signatureVersion, setSignatureVersion] = useState("HMAC_SHA256_V1");

    const updatePlan = async () => {
        let workerAmt = 0
        let total = 0
        if (on === true) {

            workerAmt = plan[1].duration === 'year' ?
                599 * (workerList.length - 1) * 11 :
                599 * (workerList.length - 1)
            total = parseFloat(plan[1].price) + parseFloat(workerAmt)
        }
        else {
            workerAmt = plan[0].duration === 'year' ?
                599 * (workerList.length - 1) * 11 :
                599 * (workerList.length - 1)
            total = parseFloat(plan[0].price) + parseFloat(workerAmt)
        }
        if (centerData.planId !== undefined && centerData.isSubscription === true) {
            console.log("payment Done")
            successToaster("Payment Already Done")
        }
        else {
            let body = {
                amount: `${total}`,
                centerId: center.centerId
            }
            const response = await instance.post(`${requests.fetchUpdatePlan}?lang=${language}`, body,
                {
                    headers: {
                        Authorization: logincenterToken,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response && response.data) {
                setFlag(true);
                setMerchantParameters(response.data.data.merchantParameters);
                setSignature(response.data.data.signature);
            }
            // if (flag === true) {
            //     // formRef.current.submit();
            //     setTimeout(document.getElementById("myForm").submit(), 10);
            // }
            // console.log(response.data.data);
            // let formData = new FormData()
            // formData.append('Ds_MerchantParameters', response.data.data.merchantParameters)
            // formData.append('Ds_Signature', response.data.data.signature)
            // formData.append('Ds_SignatureVersion', 'HMAC_SHA256_V1')
            // axios.post('https://sis.redsys.es/sis/realizarPago', formData,
            //     {
            //         headers: {
            //             "Content-Type": "application/x-www-form-urlencoded"
            //         }
            //     })
            //     .then(function (response) {
            //         console.log(response);
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     })
            // return(
            //     <>
            //     <HTMLPlan data={response.data.data}/>
            //     {console.log(response.data.data)}
            //    </>
            // )
            //   window.location.href = "./Plan.html";
        }
        }

        
    useEffect(() => {
        if (flag === true && merchantParameters !== "" && signature !== "") {
            setTimeout(document.getElementById("myForm").submit(), 10);
        }
    }, [flag, merchantParameters, signature]);
    const getWorkers = async () => {
        try {
            const response = await instance.get(
                `${requests.fetchGetWorkers}/${center.centerId}?lang=${language}`,
                {
                    headers: {
                        Authorization: logincenterToken,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            if (response && response.data) {
                setWorkerList(response.data.data);
                // dispatch()
            }
        } catch (err) {
        }
    };

    const getAllPlan = async () => {
        try {
            const response = await instance.get(requests.fetchGetPlans,
                {
                    headers: {
                        Authorization: logincenterToken,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            if (response && response.data) {
                setPlan(response.data.data);
                // dispatch()
            }
        } catch (err) {
        }
    };

    const paymentDone = async () => {
        // debugger
        console.log(plan)
        let body = {
            Ds_SignatureVersion: signatureVersion,
            Ds_MerchantParameters: merchantParameters,
            planId: on === true ? plan[1]._id : plan[0]._id,
            Ds_Signature: signature,
        }
        console.log(body)
        console.log(merchantParameters)
        const response = await instance.put(`${requests.fetchCreatePayment}/${center.centerId}`, body, {
            headers: {
                Authorization: logincenterToken,
            }
        })
        successToaster("Payment SuccessFully Done")
        console.log(response)
        // history.push('/')
    }

    useEffect(() => {
        getAllPlan()
        getWorkers();
        setFlag(false)
        let path = window.location.href
        const urlParams = new URLSearchParams(path);
        // const dataParams = Object.fromEntries(urlParams.entries());
        console.log(urlParams)
        const merchant = urlParams.get('Ds_MerchantParameters')
        console.log(merchant)
        setMerchantParameters(merchant)
        const signature = urlParams.get('Ds_Signature')
        console.log(signature)
        setSignature(signature)
        console.log(signature)
        setForPayment(true)
        // let splitPath = path.split("/")
        // console.log(splitPath)
        // if (splitPath[6]) {
        //     let tempPath = splitPath[6].split("?");
        //     console.log(tempPath)
        //     if (tempPath[1]) {
        //         let allVariable = tempPath[1].split("&");
        //         console.log(allVariable);
        //         if (allVariable[1]) {
        //             let merchantParams = allVariable[1].split("=");
        //             console.log(merchantParams)
        //             setMerchantParameters(merchantParams[1])
        //         }
        //         if (allVariable[2]) {
        //             let signatureParams = allVariable[2].split("=");
        //             console.log(signatureParams)
        //             setSignature(signatureParams[1])
        //         }
        //         
        //     }

        // }

      
        dispatch(setWorkerLoginStatus(false));
    }, [])

    useEffect(() => {
        if (forPayment === true && plan.length !== 0) {
            paymentDone()
            console.log('payment')
        }

    }, [forPayment, plan])

    return (
        <>
            <div className="mainPage-container">
                <Header
                    title="Plan Center"
                />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <p>{t("Monthly")}</p>
                    <div>
                        <FormGroup style={{ marginTop: '5px', marginLeft: '5px' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={on === true ? true : false}
                                        onChange={(e) => setOn(e.target.value)}
                                        value={on}
                                    />
                                }
                                label="Annual"
                            />
                        </FormGroup>
                    </div>
                </div>
                <Grid container>
                    {plan && plan.map((item) => {
                        let workerTotalAmt = item.duration === 'year' ?
                            599 * (workerList.length - 1) * 11 :
                            599 * (workerList.length - 1)
                        let totalPrice = parseFloat(item.price) + parseFloat(workerTotalAmt)
                        return (
                            <>
                                <Grid className="div-1" item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <div style={{ border: '2px solid red', borderRadius: '20px', width: '200px', textAlign: 'center' }}>
                                        <h5>{item.duration}</h5>
                                        <p>{center.name}</p>
                                        <p>1 Center</p>
                                        <p>+</p>
                                        <p>1 Worker</p>
                                        <p>{item.price}</p>
                                        <p>+</p>
                                        <p>599</p>
                                        <p>*</p>
                                        <p>{workerList.length} Worker</p>
                                        <p>=</p>
                                        <p>{workerTotalAmt}</p>
                                        <p>Total {totalPrice}</p>
                                    </div>
                                </Grid>
                            </>
                        )
                    })}

                    {/* <Grid className="div-1" item xs={12} sm={12} md={6} lg={6} xl={6} >
                        <div style={{ border: '2px solid red', borderRadius: '20px', width: '200px', textAlign: 'center' }}>
                            <h5>{t("Annual Rates")}</h5>
                            <p>{center.name}</p>
                            <p>1 {t("Center")}</p>
                            <p>+</p>
                            <p>1 {t("Worker")}</p>
                            <p>{19.99 * 11}</p>
                            <p>+</p>
                            <p>599</p>
                            <p>*</p>
                            <p>{workerList.length} {t("Worker")}</p>
                            <p>=</p>
                            <p>{5.99 * workerList.length * 11}</p>
                            <p>{t("Total")} {19.99 * 11 + 5.99 * workerList.length * 11}</p>
                        </div>
                    </Grid> */}
                </Grid>
                <div className="worker-btn" >
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#D61C38", color: "white" }}
                        onClick={() => { history.push("/center/admin/dashboard") }}
                    >
                        {t("Return")}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#00AD22", color: "white" }}
                        onClick={(e) => updatePlan(e)}

                    >
                        {t("Following")}
                    </Button>
                </div>
            </div>

            {
                flag === true &&
                <>
                    <div style={{ display: 'none' }}>
                        <form id="myForm" name="from" action="https://sis-t.redsys.es:25443/sis/realizarPago" method="POST" >
                            <input name="Ds_SignatureVersion" defaultValue="HMAC_SHA256_V1" />
                            <input name="Ds_MerchantParameters" value={merchantParameters} />
                            <input name="Ds_Signature" value={signature} />
                            <input type="submit" defaultValue="Submit" />
                        </form>
                        {
                            console.log(merchantParameters, "merchant")
                        }
                    </div>
                </>
            }
        </>
    )
}

export default PlanCenter
