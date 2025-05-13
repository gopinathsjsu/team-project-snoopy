import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

const BookingItem = ({ item }: { item: any }) => {
  const router = useRouter();
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          {item.name}
        </Typography>
        <Typography variant="h5" component="div">
          {item.reserveDay}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
          {item.reserveTime}
        </Typography>
        <Typography variant="body2">
          <b>Party Size: </b>
          {item.partySize} people
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            router.push(`/r/${item.id}`);
          }}
        >
          View Restaurant
        </Button>
      </CardActions>
    </Card>
  );
};

export default React.memo(BookingItem);
