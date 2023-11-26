import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { useState,useEffect } from "react";

import CloseIcon from "@mui/icons-material/Close";
import axios from "../../Axios";
import BoilerPlateCode from "../Tostify/BoilerPlateCode";
function NestedRequestModal({ open, close, user, outerClose }) {
  const [amount, setAmount] = useState(0);
  const onDecline = () => {
    close();
  };

  const [tost, settost] = useState({});
  const initial={
    open:false,
    success:false,
    data:''
  }
  useEffect(()=>{
settost(initial)
  },[])

  const setToastClosed=()=>{
    settost(initial)
  }
  const handleRequestMoney = () => {
    if (amount < 1) {
      settost({
        data: "Amount Should be greter than 0 ",
        success: false,
        open: true,
      });
    } else {
    const data = {
      amount: amount,
      toUserId: user._id,
    };
    axios
      .post("/api/payment/request", data, {
        headers: {
          "auth-token": JSON.parse(localStorage.getItem("authorization.user")),
        },
      })
      .then((res) => {
        if (res.data.success) {
          settost({
            data:'Requested User Successfully',
            success:true,
            open:true
           })
          outerClose();
          close();
        }
      }).catch(err=>{
        settost({
          data:'Falied to Request user,Please try again later ',
          success:false,
          open:true
         })
         outerClose();
         close();
      });
    }
  };

  return (
    <div>
       <BoilerPlateCode success={tost.success} open={tost.open} data={tost.data} setToastClosed={setToastClosed} />
      <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            p: 10,
            borderRadius: 4,
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <Button
            sx={{ position: "absolute", top: 8, right: 8 }}
            color="inherit"
            onClick={onDecline}
          >
            {" "}
            <CloseIcon fontSize="large" />
          </Button>
          <Grid>
            <Typography fontWeight="700">Request {user.email}</Typography>
            <Grid sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TextField
                label="Enter the Amount"
                value={amount}
                type="number"
                onChange={(e) => setAmount(parseInt(e.target.value, 10))}
              />
              <Button onClick={handleRequestMoney}>Send Request</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default NestedRequestModal;
