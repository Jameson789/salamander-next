import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";

const NavBar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: "white", boxShadow: 1 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <a href="/" style={{textDecoration: "none"}}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            
              <MovieIcon sx={{ color: "primary.main", marginRight: 1 }} />
            
            <Typography
              variant="h6"
              component="div"
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Salamander
            </Typography>
            
          </Box>
          </a>

          {/* Navigation Links */}
          <Box>
            <Button
              component={Link}
              href="/"
              sx={{
                color: "text.primary",
                mx: 1,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              href="/videos"
              sx={{
                color: "text.primary",
                mx: 1,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Videos
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
