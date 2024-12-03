import { CheckCircleOutlineRounded } from '@mui/icons-material'
import { Box, Button, Input } from '@mui/joy'
import { PATHS } from 'config'
import { useEmailVerify } from 'hooks'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function EmailVerificationPage() {
  const [isResendDisabled, setIsResendDisabled] = React.useState(false)
  const [resendCountdown, setResendCountdown] = React.useState(60)
  const [verificationCode, setVerificationCode] = React.useState('')
  const {mutate: verifyEmail, isPending} = useEmailVerify()
  const {state} = useLocation()
  const navigate = useNavigate()

  useEffect(()=> {
    const timer = setTimeout(() => {
      setIsResendDisabled(false)
    }, 60000)
    return () => clearTimeout(timer)
  }, [isResendDisabled])

  useEffect(() => {
    if (isResendDisabled) {
      const timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  } , [isResendDisabled])

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    }}>
      <Box sx={{ textAlign: "center", padding: 3, 
        width: 720,
        margin: "0 auto",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "sm",
       }}>
        {/* <CheckCircleOutlineRounded color="success" sx={{ fontSize: 50 }} /> */}
        <h1>
          We have sent you an email to verify your account
        </h1>
        <p>
          Please check your email and enter the verification code
        </p>
        <Input 
          placeholder="Verification code" 
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <Button 
          disabled={verificationCode.length < 6}
          loading={isPending}
          onClick={() => verifyEmail({email: state.email, code: verificationCode}, {
            onSuccess: () => {
              alert("Email verified successfully");
              navigate(PATHS.LOGIN)
            }
          })}
        >
          Verify my email
        </Button>
        <Button
          variant='plain' 
          disabled={isResendDisabled}
          onClick={() => {
            setIsResendDisabled(true)
            setResendCountdown(60)
          }}
        >
          Resend email {resendCountdown}s
        </Button>
      </Box>
    </div>
  )
}

export default EmailVerificationPage