import { EthProvider } from "./contexts/EthContext";

import { ChakraProvider } from "@chakra-ui/react";



import Router from "./components/Route/Route";



function App() {


  return (
    <EthProvider>
      <ChakraProvider>

        <Router />
      </ChakraProvider>
    </EthProvider >
  );
}

export default App;
