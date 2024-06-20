//package com.lecturesystem.reservationsystem.model.entity;
//
//
//public class User {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @Column
//    @NotNull
//    private String username;
//
//    @Column
//    @NotNull
//    private String password;
//
//    @Column
//    @NotNull
//    private String email;
//
//    @Column
//    @NotNull
//    private String name;
//
//    @Column(name = "last_active")
//    @NotNull
//    private LocalDateTime lastActive;
//
//    @Column(name = "is_subscribed")
//    @NotNull
//    private boolean isSubscribed;
//
//    @Column
//    @NotNull
//    private boolean isAccountNonExpired;
//
//    @Column
//    @NotNull
//    private boolean isAccountNonLocked;
//
//    @Column
//    @NotNull
//    private boolean isCredentialsNonExpired;
//
//    @Column
//    @NotNull
//    private boolean isEnabled;
//
//    @OneToMany
//    @JoinColumn(name = "user_id", referencedColumnName = "id")
//    List<Pill> pills;
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return new ArrayList<>();
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return this.isAccountNonExpired;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return this.isAccountNonLocked;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return this.isCredentialsNonExpired;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return this.isEnabled;
//    }
//}
