using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers {
    public class AutoMapperProfiles : Profile {
        public AutoMapperProfiles () {
            CreateMap<User, UserForListDto> ()
                // Mapping to get Main(profile) Photo
                .ForMember (des => des.PhotoUrl, opt => {
                    opt.MapFrom (src => src.Photos.FirstOrDefault (p => p.IsMain).Url);
                })
                // Mapping to get Age of user
                .ForMember (des => des.Age, opt => {
                    opt.ResolveUsing (d => d.DateOfBirth.CalculateAge ());
                });

            CreateMap<User, UserForDetailedDto> ()
                // Mapping to get Main(profile) Photo 
                .ForMember (des => des.PhotoUrl, opt => {
                    opt.MapFrom (src => src.Photos.FirstOrDefault (p => p.IsMain).Url);
                })
                // Mapping to get Age of user
                .ForMember (des => des.Age, opt => {
                    opt.ResolveUsing (d => d.DateOfBirth.CalculateAge ());
                });

            CreateMap<Photo, PhotosForDetailedDto> ();

            CreateMap<UserForUpdateDto, User> ();

            CreateMap<Photo, PhotoForReturnDto> ();

            CreateMap<PhotoForCreationDto, Photo> ();

            CreateMap<UserForRegisterDto, User> ();
        }
    }
}