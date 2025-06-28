import CoffeeForm from "./components/CoffeeForm";
import Hero from "./components/Hero";
import History from "./components/History";
import Layout from "./components/Layout";
import Stats from "./components/Stats";
import { useAuth } from "./context/AuthContext";

function App() {
  const { globalUser, globalData, isLoading } = useAuth();
  const isAuthentication = globalUser;

  // display data when globalData exists & length of the entries is greater then zero
  // !! - type converts into boolean value
  const isData = globalData && !!Object.keys(globalData || {}).length;

  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  );

  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthentication={isAuthentication} />
      {isAuthentication && isLoading && <p>Loading data...</p>}
      {isAuthentication && isData && authenticatedContent}
    </Layout>
  );
}

export default App;
