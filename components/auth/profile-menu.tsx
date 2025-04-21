"use client"

import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function ProfileMenu() {
  const { user, signOut, loading, isConfigured, isDemoMode } = useAuth()

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />
  }

  if ((!isConfigured && !isDemoMode) || !user) {
    return null
  }

  const userInitials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10 cursor-pointer border-2 border-[#3b82f6] hover:border-[#10b981] transition-colors">
          <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
          <AvatarFallback className="bg-[#121824]">{userInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-[#121824] border-[#1e2330]">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              {isDemoMode && (
                <Badge variant="outline" className="text-xs bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20">
                  Demo
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {isDemoMode && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-default">
              <Info className="mr-2 h-4 w-4 text-[#3b82f6]" />
              <span className="text-xs text-[#e4e4e7]/70">Running in demo mode</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
