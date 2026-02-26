import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import type { MenuPhoto, ContactInfo, UserProfile, UserWithRole, UserRole } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Management Queries
export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserWithRole[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, role }: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(principal, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

// Menu Photos Queries
export function useGetMenuPhotos() {
  const { actor, isFetching } = useActor();

  return useQuery<MenuPhoto[]>({
    queryKey: ['menuPhotos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuPhotos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMenuPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: MenuPhoto) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMenuPhoto(photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuPhotos'] });
    },
  });
}

export function useDeleteMenuPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMenuPhoto(photoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuPhotos'] });
    },
  });
}

export function useReorderMenuPhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoIds: string[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reorderMenuPhotos(photoIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuPhotos'] });
    },
  });
}

// Contact Info Queries
export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (info: ContactInfo) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactInfo(info);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}
