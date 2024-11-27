import React from "react";
import {
  Container,
  Box,
  Typography,
  Input,
  Button,
  Divider,
  Textarea,
} from "@mui/joy";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";

function ContactPage() {
  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Contact Information Section */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f9f9f9",
            padding: 4,
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <CallIcon sx={{ fontSize: 40, color: "rgb(11, 107, 203)", mr: 2 }} />
            <Typography level="h6">Call To Us</Typography>
          </Box>
          <Typography sx={{ mb: 2 }}>We are available 24/7, 7 days a week.</Typography>
          <Typography>Phone: +8801611122222</Typography>
          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <EmailIcon sx={{ fontSize: 40, color: "rgb(11, 107, 203)", mr: 2 }} />
            <Typography level="h6">Write To Us</Typography>
          </Box>
          <Typography sx={{ mb: 2 }}>Fill out our form and we will contact you within 24 hours.</Typography>
          <Typography sx={{ mb: 1 }}>Emails: customer@exclusive.com</Typography>
          <Typography>Emails: support@exclusive.com</Typography>
        </Box>

        {/* Contact Form Section */}
        <Box
          sx={{
            flex: 2,
            backgroundColor: "#f9f9f9",
            padding: 4,
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Input placeholder="Your Name *" fullWidth sx={{ backgroundColor: "#f5f5f5" }} />
            <Input placeholder="Your Email *" fullWidth sx={{ backgroundColor: "#f5f5f5" }} />
            <Input placeholder="Your Phone *" fullWidth sx={{ backgroundColor: "#f5f5f5" }} />
          </Box>
          <Textarea
            placeholder="Your Message"
            multiline
            minRows={8} 
            fullWidth
            sx={{
              backgroundColor: "#f5f5f5",
              mb: 3,
              borderRadius: "8px",
              padding: 2,
              "& .MuiInputBase-input": {
              paddingTop: 0,
              },
            }}
            InputProps={{
              style: { alignItems: "flex-start" }
            }}
          />
          <Button variant="solid" backgroundColor="rgb(11, 107, 203)" sx={{ px: 4, alignSelf: "flex-start"}}>
            Send Message
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ContactPage;
