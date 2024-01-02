import { useEffect, useState } from "react";
import "./App.css";
import { IconSearch, IconZoomQuestion } from "@tabler/icons-react";
import ReactLoading, { LoadingType } from "react-loading";
import ScrollToTop from "react-scroll-to-top";

const data =
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";

type Cities = {
  city: string;
  state: string;
  population: string;
  rank: string;
};

function App() {
  const [cities, setCities] = useState<Cities[]>([]);
  const [originalData, setOriginalData] = useState<Cities[]>([]);
  const [loading, setLoading] = useState(true);

  const LoadingStyle = ({
    type,
    color,
  }: {
    type: LoadingType;
    color: string;
  }) => <ReactLoading type={type} color={color} height={300} width={300} />;
  function numberWithCommas(x: string) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(data);
        const result = await response.json();
        setCities(result);
        setOriginalData(result);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: string) => {
    setLoading(true);
    if (!e) {
      setCities(originalData);
    } else {
      const selectCity = originalData.filter((item) => {
        return (
          item.city.toLowerCase().includes(e.toLowerCase()) ||
          item.state.toLowerCase().includes(e.toLowerCase())
        );
      });
      setCities(selectCity);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ marginTop: "50px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconSearch size={50} color="gray" />
          <input
            type="text"
            placeholder="Enter City or State"
            className="inputText"
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >{`總共『 ${cities.length} 』筆資料`}</div>
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <LoadingStyle type="spinningBubbles" color="gray" />
          </div>
        )}
        {cities.length ? (
          <>
            <ul>
              {cities.map((item) => {
                return (
                  <li key={item.rank}>
                    <span className="name">
                      {item.city}, {item.state}
                    </span>
                    <span className="population">
                      {numberWithCommas(item.population)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <ScrollToTop smooth top={400} color="white" />
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <IconZoomQuestion size={40} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
