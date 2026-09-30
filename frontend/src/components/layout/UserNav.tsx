"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon, Moon } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";

interface UserNavProps {
  user: {
    username?: string;
    email?: string;
    avatar_url?: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const initial = user.username ? user.username.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "?";
  
  // Random gradient base on initial character char code
  const charCode = initial.charCodeAt(0);
  const hue = (charCode * 15) % 360;
  const bgColor = `hsl(${hue}, 70%, 50%)`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9 border border-gray-200">
            <AvatarImage src={user.avatar_url || ""} alt={user.username || "Avatar"} />
            <AvatarFallback 
              className="text-white font-medium"
              style={{ backgroundColor: bgColor }}
            >
              {initial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer flex w-full">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Moon className="mr-2 h-4 w-4" />
            <span>Theme Mode</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
          onClick={() => logoutAction()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
