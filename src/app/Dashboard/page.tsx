import withAuth from "@/hoc/withAuth";

const Dashboard = () => {
  return <h1>Bienvenido al dashboard</h1>;
};

export default withAuth(Dashboard);
