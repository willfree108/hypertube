<template>
    <div id="app">
        <el-menu v-if='menu' theme="dark" :default-active="menuIndex" style="z-index: 2" class="el-menu-demo container menu tright" mode="horizontal" :router="modeRouter">
            <div class="lang mobile-invisible">
                <span id="en" class="hover langSelect" @click="changeLang('en')">En</span>
                <span>/</span>
                <span id="fr" class="hover" @click="changeLang('fr')">Fr</span>
            </div>
            <template v-if="isAuth" >
                <div class="searchContainer">
                    <el-input
                        class="searchMenu"
                        :placeholder="$t('search')"
                        icon="search"
                        v-model="search"
                        :on-icon-click="toggleSidebar">
                    </el-input>
                </div>
                <el-submenu index="mobile-left" style="z-index: 35" class="mobile-visible">
                    <template slot="title"><i class="fa fa-bars" aria-hidden="true"></i></template>
                    <el-menu-item index="/Gallery">Gallery <i class="fa fa-film" aria-hidden="true"></i></el-menu-item>
                    <el-menu-item index="/Settings">Settings <i class="fa fa-cog" aria-hidden="true"></i></el-menu-item>
                    <el-menu-item index="SignOut" @click="delog">Log out <i class="fa fa-sign-out" aria-hidden="true"></i></el-menu-item>
                    <el-submenu index="mobile-right" style="z-index: 35" class="mobile-visible">
                        <template slot="title"><i class="fa fa-flag" aria-hidden="true"></i></template>
                        <el-menu-item index="Fr" id="fr" class="hover" @click="changeLang('fr')">Fr</el-menu-item>
                        <el-menu-item index="En" id="en" class="hover" @click="changeLang('en')">En</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <div class="mobile-invisible">
                    <el-menu-item index="SignOut" @click="delog"><i class="fa fa-sign-out" aria-hidden="true"></i></el-menu-item>
                    <el-menu-item index="/Settings"><i class="fa fa-cog" aria-hidden="true"></i></el-menu-item>
                    <el-menu-item index="/Gallery"><i class="fa fa-film" aria-hidden="true"></i></el-menu-item>
                </div>

            </template>
            <template v-else>
                <el-menu-item index="/SignIn"><i class="fa fa-sign-in" aria-hidden="true"></i></el-menu-item>
                <el-menu-item index="/SignUp"><i class="fa fa-user-plus" aria-hidden="true"></i></el-menu-item>
                <el-menu-item index="/Recover"><i class="fa fa-question-circle" aria-hidden="true"></i></el-menu-item>
            </template>
        </el-menu>
        <el-menu v-if="isAuth" mode="vertical" default-active="sort.index" class="el-menu-vertical-demo menuSideLeft" id="sidebar">
            <el-menu-item-group :title="$t('sort')">
                <div class="sortBtn">
                    <el-switch
                        v-model="direction"
                        on-text="↖️"
                        off-text="↙️">
                    </el-switch>
                </div>
                <el-menu-item index="1" class="tcenter sort" @click="sortBy('title')">{{ $t('title') }}</el-menu-item>
                <el-menu-item index="2" class="tcenter sort" @click="sortBy('rate')">{{ $t('rate') }}</el-menu-item>
                <el-menu-item index="3" class="tcenter sort" @click="sortBy('year')">{{ $t('year') }}</el-menu-item>
                <el-menu-item-group :title="$t('filter')">
                    <div class="slider">
                        <el-col :span="20" :offset="2">
                            <vue-slider :real-time="true" ref="slider4" v-bind="sliderRangeRate" v-model="rangeRate"></vue-slider>
                        </el-col>
                    </div>
                    <div class="tcenter tslide">
                        <h1>{{ $t('rating') }}</h1>
                    </div>
                    <div class="slider">
                        <el-col :span="20" :offset="2">
                            <vue-slider :real-time="true" ref="slider4" v-bind="sliderRangeYear" v-model="rangeYear"></vue-slider>
                        </el-col>
                    </div>
                    <div class="tcenter tslide">
                        <h1>{{ $t('year') }}</h1>
                    </div>
                </el-menu-item-group>
            </el-menu-item-group>
            <div class="tcenter genre tslide">
                <h1>{{ $t('genre') }}</h1>
            </div>
            <el-tree
                :data="data2"
                show-checkbox
                @check-change="handleCheckChange"
                node-key="id"
                :default-expand-all="true">
            </el-tree>
        </el-menu>
        <div id='appFixed' class="appFixedLeft customLoader"  v-loading="isLoading" element-loading-text="Loading...">
            <transition name="slide-fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script src="./App.js"></script>

<style src="./app.css"></style>
