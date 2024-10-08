"use client";

import { TiTick } from "react-icons/ti";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from 'usehooks-ts'
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 300); // Debounce username input

  const [passwordShowToggle, setPasswordShowToggle] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
          console.log(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique(); // Call the function on debouncedUsername change
  }, [username]);

  const showPassword = () => {
    setPasswordShowToggle(!passwordShowToggle);
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      console.log("response", response.data);

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ||
        "There was a problem with your sign-up. Please try again.";

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-700">

      <div className="md:w-full sm:max-w-md p-8 min-h-[60%] bg-white rounded-lg space-y-2 shadow-lg ">

      <div className=" lg:w-full sm:max-w-md p-8 bg-white rounded-lg space-y-2 shadow-lg ">

        <div className="text-center">
          <h1 className="font-extrabold tracking-tight lg:text-4xl my-6">
            Join The Mystery Message App
          </h1>
          <p className="mb-4">Sign up to get started</p>
        </div>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-3"
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2">Username</FormLabel>
                    <FormControl>
                      <div className="flex flex-col space-y-2">
                        <Input
                          placeholder="Enter Your Username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            debouncedUsername(e.target.value); // Update local state
                          }}
                        />

                        <p
                          className={`text-sm font-semibold flex gap-1 items-center ${
                            usernameMessage === "Username is unique"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {usernameMessage}
                          {usernameMessage === "Username is unique" && (
                            <div className="bg-green-500 w-[17px] h-[17px] p-[0.rem] rounded-full flex justify-center items-center">
                              <TiTick className="text-xl text-white" />
                            </div>
                          )}
                        </p>
                        <p className="text-red-500">
                          {isCheckingUsername && (
                            <Loader2 className="animate-spin h-4 w-4" />
                          )}
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter Your Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="ml-2">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={passwordShowToggle ? "text" : "password"}
                          placeholder="Enter Your Password"
                          {...field}
                        />
                        <span
                          className="text-2 text-[#333] absolute right-4 top-2 cursor-pointer"
                          onClick={showPassword}
                        >
                          {passwordShowToggle ? "Hide" : "Show"}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Please wait ...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center my-2">
            <p>
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
