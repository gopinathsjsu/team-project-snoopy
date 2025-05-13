"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { logout } from "../auth/auth";

export default function DropDownNav() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [user, setUser] = React.useState<any>(undefined);

  React.useEffect(() => {
    const u = localStorage.getItem("userInfo");
    setUser(u && JSON.parse(u));
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    router.push("/auth/login");
    handleClose();
  };
  const handleRegister = () => {
    router.push("/auth/register");
    handleClose();
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    window.location.href = "/auth/login";
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.name.slice(0, 1)}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            router.push("/");
            handleClose();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Home
        </MenuItem>
        {user && user.role === "manager" && (
          <MenuItem
            onClick={() => {
              router.push("/restaurant/listing/create");
              handleClose();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Create Restaurant
          </MenuItem>
        )}
        {user && user.role === "admin" && (
          <MenuItem
            onClick={() => {
              router.push("/restaurant/admin/approvals");
              handleClose();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Pending Listings
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            router.push("/restaurant/bookings");
            handleClose();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          My Bookings
        </MenuItem>
        <Divider />

        {!user && (
          <MenuItem onClick={handleSignIn}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
        {!user && (
          <MenuItem onClick={handleRegister}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Register
          </MenuItem>
        )}
        {user && (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
