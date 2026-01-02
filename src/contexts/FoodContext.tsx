import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { FoodItem } from "../lib/interface";
import { FetchFoodItems } from "../../api";

interface FoodContextType {
  foods: FoodItem[];
  loading: boolean;
}

const FoodContext = createContext<FoodContextType>({} as FoodContextType);

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const data = await FetchFoodItems();
      setFoods(data);
    } catch (error) {
      console.error("Failed to fetch food items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <FoodContext.Provider value={{ foods, loading }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) throw new Error("useFood must be used within FoodProvider");
  return context;
};

export default FoodContext;


