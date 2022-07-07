import React, { Component } from "react";
import Slider from "./Slider";
import form_logo from '../public/images/credin-logo.png';
import adhar from '../public/images/addhar.png';
import lock_icon from '../public/images/password-icon.svg';
import pancard from '../public/images/pan.png';
import ebill from '../public/images/ebill.png';
import '../components/login-signup.css';
import '../components/cta-btn.css';
//import { useFormik } from "formik";
//import { Link } from "react-router-dom";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as moment from 'moment';
declare var AWS;
declare var ithours_client;

const SignUp = () => {
  const formik = useFormik({
    initialValues: {
      pan: [],
      aadharfront: [],
      aadharback: [],
      selfPhoto: [],
      self: "",
      LoginText: 'NEXT'
    },
    validate: (values) => {
      const error = {};
      if (!values.pan) {
        error.pan = "Please submit your PAN Card."
      }
      if (!values.aadharfront) {
        error.aadharfront = "Please submit your Aadhar Front ."
      }

      if (!values.aadharback) {
        error.aadharback = "Please submit your Aadhar Back."
      }

      if (!values.selfPhoto) {
        error.selfPhoto = "Please submit your Electricity Bill ."
      }
      return error;
    },
    onSubmit: (values,
      {
        setSubmitting,
      }) => {
      apicall();

      setSubmitting(true);
      //alert(JSON.stringify(values, null, 2));
    },

  });
  const history = useHistory();

  const apicall = async () => {
    debugger
    formik.initialValues.LoginText = 'GOING...'
    var borrower_id = window.localStorage.getItem("BID");

    let Data = {
      _id: borrower_id,
      updateQuery: {
        pandocumentfiles: formik.values.pan,
        addharfrontfiles: formik.values.aadharfront,
        addharbackfiles: formik.values.aadharback,
      },
    }

    let updatedRegistrationData = await ithours_client.shared("Digio", "verifyWebsiteBorrowerOCR", Data);
    console.log(updatedRegistrationData);

    let temp = 0;

    var findQuery = {
      _id: borrower_id,
    };
    var updateQuery = {
      borrowerphoto: formik.initialValues.self,
    }
    let updatedRes = await ithours_client.update("borrower", findQuery, updateQuery);
    console.log(updatedRes, "check signup email")
    let dasssta = await ithours_client.getOne("borrower", {
      _id: borrower_id,
    });

    console.log(dasssta, "check signup email")

    if ((formik.values.pan == "") && (formik.values.aadharfront == "") && (formik.values.aadharback == "") && (formik.values.selfPhoto == "")) {
      setTimeout(() => {
        toast.dark("No file selected.", {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
        });
      },
        3000);
      temp = temp + 1;

    }
    else {
      if (formik.values.pan == "") {
        toast.dark("Pan Card is mandatory.", {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
        }); temp = temp + 1;
      }
      if (formik.values.aadharfront == "") {
        toast.dark("Adhar Front side is a mandatory field.", {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
        }); temp = temp + 1;
      }
      if (formik.values.aadharback == "") {
        toast.dark("Adhar Back side is a mandatory field.", {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
        }); temp = temp + 1;
      }
      if (formik.values.selfPhoto == "") {
        toast.dark("Self Photo is a mandatory.", {
          position: 'bottom-right',
          autoClose: 2000,
          hideProgressBar: true,
        }); temp = temp + 1;
      }
    }
    if (temp == 0) {
      toast.dark("Documents has been submitted successfully.", {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true,
      });


      var findQuery = {
        _id: borrower_id,
      };
      debugger
      var updateQuery = {
        OTPverification: true,
      }
      let updatedRes = await ithours_client.update("borrower", findQuery, updateQuery);
      console.log(updatedRes)
      setTimeout(() => {
        history.push(`/dashboard`);
      }, 1000);
    }

    console.log("api data");
    //console.log(values.user_name);        
  };


  const generateUUID = () => {
    let d = new Date().getTime();
    const uuid = "xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  const getAWSObj = () => {
    const albumBucketName = "credinfiles";
    const bucketRegion = "ap-south-1";
    const IdentityPoolId = "ap-south-1:45694495-498c-4f9b-9d9f-628401c645aa";
    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId,
      }),
    });
    return new AWS.S3({
      apiVersion: "2012-10-17", //'2006-03-01',
      params: {
        Bucket: albumBucketName,
      },
    });
  }


  const uploadDoc = async (field, e) => {


    var toUpdate = await uploadToAWS(e);
    console.log(toUpdate)
    formik.setFieldValue(field, [toUpdate]);
  }
  const uploadDoc1 = async (field, e) => {


    var toUpdate = await uploadToAWS(e);
    console.log(toUpdate)
    formik.setFieldValue(field, [toUpdate]);
  }
  const uploadDoc2 = async (field, e) => {

    var toUpdate = await uploadToAWS(e);
    console.log(toUpdate)
    formik.setFieldValue(field, [toUpdate]);
  }
  const uploadDoc3 = async (field, e) => {
    debugger

    var toUpdate = await uploadToAWS(e);
    formik.initialValues.self = toUpdate.url
    console.log(formik.initialValues.self)
    formik.setFieldValue(field, [toUpdate]);
  }

  const uploadToAWS = (element) => {
    return new Promise((resolve, reject) => {
      var currentFile = element.target.files[0];
      var self = this;
      let fileName = currentFile.name || (new Date().getTime().toString() + ".png");
      let filetype = fileName.split(".")[1];
      let fileNameToSend = generateUUID() + fileName.substring(fileName.indexOf("."), fileName.length);
      let photoKey = "credin/" + moment().format("MMDDYYYY") + "/" + fileNameToSend;
      getAWSObj().upload(
        {
          Key: photoKey,
          Body: currentFile,
          ACL: "public-read",
        },
        async function (err, data) {
          // await self.api_service.hideLoader();
          if (err) {
            alert("There was an error uploading your Image: ");
          } else {
            const filedata = data.Location;
            resolve({
              name: fileName,
              filetype: filetype,
              url: filedata,
              isVerified: false,
            })
          }
        }
      );
    })
  }

  return (
    <div className="account-wrap">
      <div className='row no-gutters'>
        <div className="col-lg-8">
          <Slider />
        </div>
        <div className="col-lg-4">
          <div className="form-wrap account-form">
            <div className="account-form-logo">
              <img src={form_logo} />
            </div>
            <form onSubmit={formik.handleSubmit}>
              <ToastContainer />
              <h3 className="account-form-title">Documents Upload</h3>

              <div className="form-group">
                <span style={{ color: "black", fontSize: 14, marginLeft: -35, }}>Upload Pancard*</span>
                <img style={{ width: '17px', height: '20px', position: "absolute", top: 40, }} src={pancard} alt="" />
                <input type="file" maxLength="32" onChange={(e) => uploadDoc('pan', e)} className="border border-0" />
              </div>
              {formik.errors.pan &&
                formik.touched.pan &&
                <span style={{ color: "red" }}>{formik.errors.pan}</span>}

              <div className="form-group">
                <span style={{ color: "black", fontSize: 14, marginLeft: -35 }}>Upload Aadhar Front Side*</span>
                <img style={{ width: '20px', height: '18px', position: "absolute", top: 40, }} src={adhar} alt="" />
                <input type="file" maxLength="10" onChange={(e) => uploadDoc1('aadharfront', e)} className="border border-0" />
              </div>
              {formik.errors.aadharfront &&
                formik.touched.aadharfront &&
                <span style={{ color: "red" }}>{formik.errors.aadharfront}</span>}

              <div className="form-group">
                <span style={{ color: "black", fontSize: 14, marginLeft: -35, }}>Upload Aadhar Back Side*</span>
                <img style={{ width: '20px', height: '18px', position: "absolute", top: 40, }} src={adhar} alt="" />
                <input type="file" maxLength="20" onChange={(e) => uploadDoc2('aadharback', e)} className="border border-0" />
              </div>
              {formik.errors.aadharback &&
                formik.touched.aadharback &&
                <span style={{ color: "red" }}>{formik.errors.aadharback}</span>}
              <div className="form-group">
                <span style={{ color: "black", fontSize: 14, marginLeft: -35, }}>Upload Self Photo*</span>
                <img style={{ width: '20px', height: '18px', position: "absolute", top: 40, }} src={ebill} alt="" />
                <input type="file" maxLength="20" onChange={(e) => uploadDoc3('selfPhoto', e)} className="border border-0" />
              </div>
              {formik.errors.selfPhoto &&
                formik.touched.selfPhoto &&
                <span style={{ color: "red" }}>{formik.errors.selfPhoto}</span>}

              <div className="submit-btn">
                <button type="submit" className="cta-btn" >{formik.initialValues.LoginText}</button>
              </div>
              <div className="author-form-note">
                {/* By creating an account you agree to our <a href="https://credin.shiksha/terms-and-conditions/">Terms of Service</a> and <a href="https://credin.shiksha/privacy-policy/">Privacy Policy</a> */}
                {/* <p>If you have already account .</p> */}
                <div style={{ textAlign: 'center' }}><Link to="/">Sign In</Link> </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUp