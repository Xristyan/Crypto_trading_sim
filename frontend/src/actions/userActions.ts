"use server";

import { fetchApi } from "@/helpers/actionHelpers";
import { RequestMethodsEnum } from "@/types/actionTypes";
import { User } from "@/types/userTypes";

export const fetchUser = async (): Promise<User | null | undefined> => {
  const { data, error } = await fetchApi<User>(
    `${process.env.BACKEND_URL}/api/users/${process.env.DEFAULT_USER_ID}`,
    {
      method: RequestMethodsEnum.GET,
    }
  );

  if (error) {
    return null;
  }

  return data;
};

export const buyCrypto = async (
  cryptoSymbol: string,
  amount: string,
  pricePerUnit: number
) => {
  const { data, error } = await fetchApi<User>(
    `${process.env.BACKEND_URL}/api/users/${process.env.DEFAULT_USER_ID}/buy`,
    {
      method: RequestMethodsEnum.POST,
      body: {
        cryptoSymbol,
        amount: amount,
        pricePerUnit: pricePerUnit.toString(),
      },
    }
  );

  console.log(error);
  if (error) {
    return { error: error };
  }

  return { data, error: null };
};

export const sellCrypto = async (
  cryptoSymbol: string,
  quantity: number,
  pricePerUnit: number
) => {
  const { data, error } = await fetchApi<User>(
    `${process.env.BACKEND_URL}/api/users/${process.env.DEFAULT_USER_ID}/sell`,
    {
      method: RequestMethodsEnum.POST,
      body: {
        cryptoSymbol,
        quantity: quantity.toString(),
        pricePerUnit: pricePerUnit.toString(),
      },
    }
  );

  if (error) {
    return { error: error };
  }

  return { data, error: null };
};

export const resetUser = async () => {
  const { data, error } = await fetchApi<User>(
    `${process.env.BACKEND_URL}/api/users/${process.env.DEFAULT_USER_ID}/reset`,
    {
      method: RequestMethodsEnum.POST,
    }
  );

  if (error) {
    return null;
  }

  return data;
};
