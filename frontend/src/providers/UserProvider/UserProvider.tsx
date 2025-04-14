"use client";
import { User } from "@/types/userTypes";
import { createContext, useCallback, useContext, useState } from "react";
import { fetchUser as fetchUserAction } from "@/actions/userActions";
import { buyCrypto as buyCryptoAction } from "@/actions/userActions";
import { sellCrypto as sellCryptoAction } from "@/actions/userActions";
import { resetUser as resetUserAction } from "@/actions/userActions";

type UserContextType = {
  user: User | null | undefined;
  setUser: (user: User | null | undefined) => void;
  buyCrypto: (
    cryptoSymbol: string,
    amount: string,
    pricePerUnit: number
  ) => Promise<{ error: string | null }>;
  sellCrypto: (
    cryptoSymbol: string,
    quantity: number,
    pricePerUnit: number
  ) => Promise<{ error: string | null }>;
  reset: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  buyCrypto: () => Promise.resolve({ error: "" }),
  sellCrypto: () => Promise.resolve({ error: "" }),
  reset: () => Promise.resolve(),
});

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null | undefined;
}) => {
  const [user, setUser] = useState<User | null | undefined>(initialUser);

  const revalidateUser = useCallback(async () => {
    const user = await fetchUserAction();
    setUser(user);
  }, []);

  const buyCrypto = useCallback(
    async (cryptoSymbol: string, amount: string, pricePerUnit: number) => {
      const { error } = await buyCryptoAction(
        cryptoSymbol,
        amount,
        pricePerUnit
      );
      await revalidateUser();

      return { error: error };
    },
    [revalidateUser]
  );

  const sellCrypto = useCallback(
    async (cryptoSymbol: string, quantity: number, pricePerUnit: number) => {
      const { error } = await sellCryptoAction(
        cryptoSymbol,
        quantity,
        pricePerUnit
      );
      await revalidateUser();

      return { error: error };
    },
    [revalidateUser]
  );

  const reset = useCallback(async () => {
    await resetUserAction();
    await revalidateUser();
  }, [revalidateUser]);

  return (
    <UserContext.Provider
      value={{ user, setUser, buyCrypto, sellCrypto, reset }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
